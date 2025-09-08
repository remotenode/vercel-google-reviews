/**
 * Custom TypeScript declaration file for @vercel/node types
 * This enables local compilation without the actual @vercel/node package
 */

export interface VercelRequest {
  method?: string;
  url?: string;
  headers?: { [key: string]: string | string[] | undefined };
  query?: { 
    appid?: string | string[];
    country?: string | string[];
    lang?: string | string[];
    date?: string | string[];
    [key: string]: string | string[] | undefined;
  };
  body?: any;
  cookies?: { [key: string]: string };
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): VercelResponse;
  send(data: any): VercelResponse;
  end(data?: any): VercelResponse;
  setHeader(name: string, value: string): VercelResponse;
  getHeader(name: string): string | string[] | undefined;
  removeHeader(name: string): VercelResponse;
}
