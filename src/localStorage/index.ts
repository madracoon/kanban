import { getListChildren, getCardChildren } from "utils"
import { Card, Comment } from "types"

export const getAllLists = () => JSON.parse(localStorage.getItem("lists") as string)
export const getAllCards = () => JSON.parse(localStorage.getItem("cards") as string)
export const getAllComments = () => JSON.parse(localStorage.getItem("comments") as string)

//////////
// Lists
//////////

export const addNewList = (data: any) => {
  const lists = JSON.parse(localStorage.getItem("lists") as string)
  const updatedLists = lists.concat(data)
  localStorage.setItem("lists", JSON.stringify(updatedLists))

  return data;
}

export const updateList = (data: any) => {
  const {id, name} = data;
  const lists = JSON.parse(localStorage.getItem("lists") as string)
  const updatedList = lists.map((item: any) => { 
    if (item.id === id) item.name = name;
    return item
  })
  
  localStorage.setItem("lists", JSON.stringify(updatedList))

  return data;
}

export const destroyLists = (ids: Array<number>) => {
  const cardsIds = getListChildren(ids);
  const commentsIds = getCardChildren(cardsIds);

  destroyCards(cardsIds);

  const lists = JSON.parse(localStorage.getItem("lists") as string)  
  const toRemove = new Set(ids);
  const updatedList = lists.filter((item: any) => !toRemove.has(item.id));
  localStorage.setItem("lists", JSON.stringify(updatedList))

  return { lists: ids, cards: cardsIds, comments: commentsIds };
}
//////////
// Cards
//////////

export const addNewCard = (data: any) => {
  const cards = JSON.parse(localStorage.getItem("cards") as string)
  const lastId = cards.sort((a: Card, b: Card) => a.id - b.id)[cards.length - 1].id || 0
  const newData = {id: lastId + 1, ...data};
  const updatedCards = cards.concat(newData)

  localStorage.setItem("cards", JSON.stringify(updatedCards))

  return newData;
}

export const updateCard = (data: Card) => {
  const { id } = data;
  const cards = JSON.parse(localStorage.getItem("cards") as string)
  const updatedCards = cards.map((item: Card) => { 
    if (item.id === id) item = data;
    return item;
  })
  
  localStorage.setItem("cards", JSON.stringify(updatedCards))

  return data;
} 

export const destroyCards = (ids: Array<number>) => {
  const commentsIds = getCardChildren(ids); 
  destroyComments(commentsIds);

  const cards = JSON.parse(localStorage.getItem("cards") as string)
  const toRemove = new Set(ids)
  const updatedCards = cards.filter((item: any) => !toRemove.has(item.id));

  localStorage.setItem("cards", JSON.stringify(updatedCards))

  return { cards: ids, comments: commentsIds };
}
////////////
// Comments
////////////

export const addNewComment = (data: any) => {
  const comments = JSON.parse(localStorage.getItem("comments") as string)
  const lastId = comments.sort((a: Comment, b: Comment) => a.id - b.id)[comments.length - 1].id || 0
  const updatedComments = comments.concat({id: lastId + 1, ...data})
  localStorage.setItem("comments", JSON.stringify(updatedComments))

  return {id: lastId + 1, ...data}
}

export const destroyComments = (ids: Array<number>) => {
  const comments = JSON.parse(localStorage.getItem("comments") as string)
  const toRemove = new Set(ids)
  const updatedComments = comments.filter((item: any) => !toRemove.has(item.id));

  localStorage.setItem("comments", JSON.stringify(updatedComments))

  return { comments: ids };
}