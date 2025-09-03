declare module '@vercel/node' {
  export interface VercelRequest {
    url?: string;
    headers: Record<string, string | string[] | undefined>;
    query: Record<string, string | string[] | undefined>;
    method: string;
    body?: any;
  }

  export interface VercelResponse {
    status(code: number): VercelResponse;
    json(data: any): void;
    send(data: any): void;
  }
}

