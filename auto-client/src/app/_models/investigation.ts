export interface Investigation {
    meta:    Meta;
    results: Result[];
}

export interface Meta {
    status:     number;
    messages:   any[];
    pagination: Pagination;
    filters:    null;
    decoder:    any[];
}

export interface Pagination {
    count:       number;
    max:         number;
    offset:      number;
    sort:        string;
    order:       null;
    total:       number;
    currentUrl:  string;
    nextUrl:     null;
    previousUrl: null;
}

export interface Result {
    data: Result;
    investigations: InvestigationResult[];
}

export interface InvestigationResult {
    nhtsaActionNumber:        string;
    subject:                  string;
    summary:                  string;
    dateOpened:               any;
    dateClosed:               any;
    type:                     string;
    components:               Component[];
    associatedDocumentsCount: number;
    associatedDocuments:      AssociatedDocument[];
    associatedProductsCount:  number;
    associatedProducts:       AssociatedProduct[];
    recalls:                  any[];
}

export interface AssociatedDocument {
    id:       number;
    fileName: string;
    fileSize: number;
    loadDate: Date;
    metaData: MetaDatum[];
    mimeType: string;
    summary:  string;
    url:      string;
}

export interface MetaDatum {
    id: number;
}

export interface AssociatedProduct {
    type:         string;
    productYear:  string;
    productMake:  string;
    productModel: string;
    manufacturer: string;
}

export interface Component {
    id:          number;
    name:        string;
    description: string;
}
