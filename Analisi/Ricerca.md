# Analisi dello Sviluppo di un Motore di Ricerca Interno in ASP.NET Core

## Introduzione

Il motore di ricerca interno ha lo scopo di permettere la ricerca tra i "contenuti" del framework. Tuttavia, il concetto di "contenuto" deve essere definito in modo chiaro per garantire una corretta implementazione. Questo documento fornisce un'analisi dettagliata dello sviluppo del motore di ricerca, dalla definizione dei contenuti fino all'implementazione tecnica.


## Definizione dei Contenuti

Prima di implementare il motore di ricerca, è necessario stabilire cosa si intende per "contenuto". Una soluzione efficace è l'uso di **Custom Attributes** per marcare le classi e le proprietà che devono essere indicizzate dal motore di ricerca. Inoltre, una tabella di categorie può essere utilizzata per gestire le proprietà da indicizzare.

### Definizione di un Attributo Personalizzato

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = false)]
public class SearchableAttribute : Attribute
{
    public string Category { get; }
    public bool IsBodyPart { get; }

    public SearchableAttribute(string category, bool isBodyPart = false)
    {
        Category = category;
        IsBodyPart = isBodyPart;
    }
}
```

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = false)]
public class SearchableKeyAttribute : Attribute
{
    public int Index { get; }

    public SearchableKeyAttribute(int index)
    {
        Index = index;
    }
}
```

### Esempio di Applicazione dell'Attributo ai Contenuti

```csharp
[Searchable("Article")]
public class Article
{
    [SearchableKey(0)]
    public int Id { get; set; }

    [SearchableKey(1)]
    public int CategoryKey { get; set; }

    [Searchable("Title")]
    public string Title { get; set; }

    [Searchable("Body", true)]
    public string Introduction { get; set; }

    [Searchable("Body", true)]
    public string MainContent { get; set; }

    [Searchable("Body", true)]
    public string Conclusion { get; set; }
}
```

### Gestione delle Categorie e delle Proprietà Indicizzabili

```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<string> IndexableProperties { get; set; }
}
```

### Generazione dell'URL dai Risultati di Ricerca

```csharp
public static class UrlGenerator
{
    public static string GenerateUrl<T>(T entity, Category category)
    {
        var keyProperties = typeof(T).GetProperties()
            .Where(prop => prop.GetCustomAttribute<SearchableKeyAttribute>() != null)
            .OrderBy(prop => prop.GetCustomAttribute<SearchableKeyAttribute>()?.Index ?? 0)
            .Select(prop => prop.GetValue(entity)?.ToString())
            .Where(value => !string.IsNullOrEmpty(value))
            .ToArray();

        return keyProperties.Length > 0 ? $"/{category.Name.ToLower()}/{string.Join("/", keyProperties)}" : "#";
    }
}
```

## Gestione del Body Composto da Più Proprietà

Poiché il "body" può essere suddiviso in più proprietà, il motore di ricerca deve:

1. **Concatenare le proprietà marcate come `IsBodyPart = true`** per creare un'unica stringa indicizzabile.
2. **Indicizzare e cercare all'interno di questa stringa aggregata**.

### Creazione della Stringa di Body per la Ricerca

```csharp
public static class SearchHelper
{
    public static string AggregateBody<T>(T content)
    {
        var bodyParts = typeof(T).GetProperties()
            .Where(prop => prop.GetCustomAttribute<SearchableAttribute>()?.IsBodyPart == true)
            .Select(prop => prop.GetValue(content)?.ToString())
            .Where(value => !string.IsNullOrEmpty(value));

        return string.Join(" ", bodyParts);
    }
}
```


## Implementazione Tecnica

### Definizione dell'Interfaccia di Ricerca

```csharp
public interface ISearchProvider
{
    Task<IEnumerable<SearchResult>> SearchAsync(string query, SearchOptions options);
}
```

### Classe per i Risultati della Ricerca

```csharp
public class SearchResult
{
    public string Category { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string Url { get; set; }
    public double Score { get; set; }
}
```

### Implementazione del Provider per Elasticsearch

```csharp
public class ElasticSearchProvider : ISearchProvider
{
    private readonly ElasticClient _client;
    private readonly List<Category> _categories;

    public ElasticSearchProvider(ElasticClient client, List<Category> categories)
    {
        _client = client;
        _categories = categories;
    }

    public async Task<IEnumerable<SearchResult>> SearchAsync(string query, SearchOptions options)
    {
        var response = await _client.SearchAsync<SearchResult>(s => s
            .Query(q => q.QueryString(d => d.Query(query)))
        );

        return response.Documents.Select(d => 
        {
            var category = _categories.FirstOrDefault(c => c.Name == d.Category);
            return new SearchResult
            {
                Title = d.Title,
                Body = d.Introduction,
                Url = UrlGenerator.GenerateUrl(d, category),
                Score = response.MaxScore ?? 1.0
            };
        });
    }
}
```

### Implementazione del Provider per SQL Server

```csharp
public class SqlSearchProvider : ISearchProvider
{
    private readonly DbContext _context;
    private readonly List<Category> _categories;

    public SqlSearchProvider(DbContext context, List<Category> categories)
    {
        _context = context;
        _categories = categories;
    }

    public async Task<IEnumerable<SearchResult>> SearchAsync(string query, SearchOptions options)
    {
        var results = await _context.Contents
            .Where(c => EF.Functions.Contains(c.Title, query) || EF.Functions.Contains(c.Body, query))
            .ToListAsync();

        foreach (var record in results)
        {
            if (record.Title.Contains(query))
                record.Score += 2;
            if (record.Body.Contains(query))
                record.Score += 1;
        }

        return results.Select(record =>
        {
            var category = _categories.FirstOrDefault(c => c.Name == record.Category);
            return new SearchResult
            {
                Title = record.Title,
                Body = record.Body,
                Url = UrlGenerator.GenerateUrl(record, category),
                Score = record.Score
            };
        });
    }
}
```

## Aggiunta dei Contenuti agli Indici

Per mantenere gli indici aggiornati, possiamo creare un'interfaccia `IIndexUpdater` e implementare classi specifiche per Elasticsearch e SQL Server.

### Definizione dell'Interfaccia di Aggiornamento Indici

```csharp
public interface IIndexUpdater
{
    Task UpdateIndexAsync<T>(T entity);
}
```

### Implementazione dell'Aggiornamento Indici per Elasticsearch

```csharp
public class ElasticIndexUpdater : IIndexUpdater
{
    private readonly ElasticClient _client;

    public ElasticIndexUpdater(ElasticClient client)
    {
        _client = client;
    }

    public async Task UpdateIndexAsync<T>(T entity)
    {
        await _client.IndexDocumentAsync(entity);
    }
}
```

### Implementazione dell'Aggiornamento Indici per SQL Server

```csharp
public class SqlIndexUpdater : IIndexUpdater
{
    private readonly DbContext _context;

    public SqlIndexUpdater(DbContext context)
    {
        _context = context;
    }

    public async Task UpdateIndexAsync<T>(T entity)
    {
        _context.Update(entity);
        await _context.SaveChangesAsync();
    }
}
```

### Utilizzo dell'Index Updater

Quando un nuovo contenuto viene aggiunto o modificato, possiamo chiamare il metodo `UpdateIndexAsync` per aggiornare gli indici.

```csharp
public class ContentService
{
    private readonly IIndexUpdater _indexUpdater;

    public ContentService(IIndexUpdater indexUpdater)
    {
        _indexUpdater = indexUpdater;
    }

    public async Task AddOrUpdateContentAsync<T>(T content)
    {
        // Aggiungi o aggiorna il contenuto nel database
        // ...existing code...

        // Aggiorna l'indice
        await _indexUpdater.UpdateIndexAsync(content);
    }
}
```

## Conclusioni

Il motore di ricerca supporta sia SQL che Elasticsearch attraverso provider configurabili. Attraverso la gestione dei custom attribute sulle classi e l'uso di una tabella di categorie, è possibile definire quali oggetti sono "contenuti" e il link al dettaglio di tali contenuti. Inoltre, l'aggiornamento degli indici è gestito tramite l'interfaccia `IIndexUpdater` e le sue implementazioni specifiche per Elasticsearch e SQL Server.

