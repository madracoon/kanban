import { getAllCards, getAllComments } from "localStorage"

export const getListTreeIds = (data: any, id: number) => {
  const cardsIds = data.cards.cards.filter((item: any) => item.listId === id).map((elem: any) => elem.id);
  const commentsIds = data.comments.comments.filter((item: any) => cardsIds.includes(item.cardId)).map((elem: any) => elem.id);

  return { cards: cardsIds, comments: commentsIds }
}

export const getCardTreeIds = (data: any, ids: Array<number>) => {
  const commentsIds = data.comments.comments.filter((item: any) => ids.includes(item.cardId)).map((elem: any) => elem.id);

  return { comments: commentsIds }
}

//////////////////

export const getListChildren = (ids: Array<number>) => {
  const cards = getAllCards();
  const cardsIds = cards.filter((item: any) => ids.includes(item.listId)).map((elem: any) => elem.id);

  return cardsIds;
}

export const getCardChildren = (ids: Array<number>) => {
  const comments = getAllComments();
  const commentsIds = comments.filter((item: any) => ids.includes(item.cardId)).map((elem: any) => elem.id);

  return commentsIds;
}