export interface IResponse {
    Code?: number;
    Status: string;
    Message: any;
    Detail?: any
}

export interface IOpt {
    opt1?: any;
}

export type QuestionType = "checkbox" | "radio" | "textarea" ;
