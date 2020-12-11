export type Card = {
  id: number,
  listId: number,
  name: string,
  details?: string
}

export type Comment = {
  id: number,
  cardId: number,
  text: string,
  author?: string
}