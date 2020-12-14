export const getListTreeIds = (data, id) => {
  const cardsIds = data.cards.cards.filter((item) => item.listId === id).map((elem) => elem.id);
  const commentsIds = data.comments.comments.filter((item) => cardsIds.includes(item.cardId)).map((elem) => elem.id);

  return { cards: cardsIds, comments: commentsIds }
}