export interface SiteConfig {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    links: {
        twitter?: string;
        github?: string;
    };
}

export interface BreadcrumbItem {
    label: string;
    href: string;
}

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export interface PageProps {
    params: Promise<Record<string, string>>;
    searchParams: Promise<SearchParams>;
}
