export type Produto = {
    id: string
    nome: string
    preco: number
    categoria: string
    descricao: string
    estoque: number
    imagem?: string 
}

export type OpcaoCategoria = {
    valor: string
    label: string
}

export type UnidadePeso = "g" | "kg"

export type Ingrediente = {
    id: string          
    nome: string
    quantidade: number
    unidade: UnidadePeso
}

export type NovoProduto = {
    nome: string
    categoria: string       
    foto: string | null      
    preco: number            
    descricao: string
    preparo: string          
    rendimento: string         
    ingredientes: Omit<Ingrediente, "id">[]
    ativo: boolean
}

export type RespostaCadastro = {
    sucesso: boolean
    mensagem: string
}