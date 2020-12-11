import React, { useEffect } from 'react'
import styles from './board.module.scss'
import List from './components/List'
import { actions } from 'store/ducks/lists'
import { actions as allActions } from 'store'
import { useSelector, useDispatch } from "react-redux";

function Board() {
  const dispatch = useDispatch();
  const storeLists = useSelector((state: any) => state.lists.lists)

  useEffect(() => {
    dispatch(actions.fetchLists());
    dispatch(allActions.cards.fetchAllCards())
    dispatch(allActions.comments.fetchComments())
  }, []);

  const handleAddColumnClick = () => {
    const nextId = storeLists.length > 0 ? storeLists[storeLists.length - 1].id + 1 : 1;

    dispatch(actions.addList({ id: nextId, name: 'change name' }))
  }

  return(
    <div className={styles.fill}>
      <h1>Wow, such board!</h1>
      <button onClick={handleAddColumnClick}>Add new list</button>
      <div className={styles.wrapper}>
        {storeLists.map((item: any, index: number) => <List key={index} id={item.id} name={item.name} />)}
      </div>
    </div>
  )
}

export default Board;