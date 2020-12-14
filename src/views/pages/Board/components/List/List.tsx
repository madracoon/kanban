import React, { useRef, useState } from 'react'
import styles from './list.module.scss';
import { actions, selectors } from 'store'
import { useSelector, useDispatch } from "react-redux";
import Card from "../Card"

interface Props {
  id: number,
  name: string
}

function List(props: Props) {
  const { name, id } = props;
  const [isTitleVisible, setIsTitleVisible] = useState<boolean>(true);
  const headerTextInput = useRef<HTMLTextAreaElement>(null);

  const dispatch = useDispatch();
  const cards = useSelector((state: any) => selectors.cards.selectCardsByListId(state, id));

  const handleRenameClick = (e: React.MouseEvent) => {
    // Swap name with textarea
    if (headerTextInput.current) {
      headerTextInput.current.value = name;
    }

    setIsTitleVisible(false);
    if (headerTextInput.current) headerTextInput.current.focus();
  }

  const handleChangeRename = () => {
    const name = headerTextInput.current && headerTextInput.current.value

    dispatch(actions.lists.renameList({id: id, name: name}))
    setIsTitleVisible(true);
  }

  const handleAddCardClick = () => {
    dispatch(actions.cards.addCard({listId: id, name: 'Add Task', details: ''}))
  }

  const handleRenameEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  const handleRemoveList = () => {
    dispatch(actions.lists.removeList({id: id}))
  }

  const cardList = cards.map((item: any, index: number) =>
      <Card key={index} {...item} />
    )

  return(
    <div className={styles.wrapper}>
        <div className={styles.content}>
          <textarea 
            className={`${styles.listHeaderTextarea}` + (isTitleVisible ? ` ${styles.isHidden}` : '') } 
            ref={headerTextInput} 
            onBlur={handleChangeRename}
            onKeyPress={(e) => handleRenameEnterKey(e)}
          >
          </textarea>  
          <div className={`${styles.listHeader}` + (!isTitleVisible ? ` ${styles.isHidden}` : '')}  onClick={handleRenameClick}>{name}</div>
            {cardList}
          <div className={styles.addCard} onClick={handleAddCardClick}>Add new</div>
          <div className="add-card" onClick={handleRemoveList}>Remove</div>
        </div>
      </div>
  )
}

export default List;