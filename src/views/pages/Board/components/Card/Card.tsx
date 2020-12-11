import React, { useRef, useState } from "react"
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Comment from '../Comment'
import { actions, selectors } from 'store';
import { useSelector, useDispatch } from "react-redux";
import styles from "./card.module.scss"

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    width: '600px',
    height: '400px',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    display: 'flex',
    'flex-direction': 'column'
  }
};

Modal.setAppElement('#root')

function Card(props: any) {
  const { id, name, details, listId } = props;

  const [isTitleVisible, setIsTitleVisible] = useState<boolean>(true);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(true);
  const [modalIsOpen,setIsOpen] = useState<boolean>(false);

  const cardHeaderInput = useRef<HTMLTextAreaElement>(null);
  const cardDetailsInput = useRef<HTMLTextAreaElement>(null);
  const cardCommentInput = useRef<HTMLTextAreaElement>(null);

  const comments = useSelector((state: any) => selectors.comments.selectCommentsByCardId(state, id));
  const commentList = comments.map((item: any, index: number) =>
      <Comment key={index} {...item} />
    )

  const dispatch = useDispatch();
  
  // Modal
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
  }

  function closeModal(){
    setIsOpen(false);
  }
  // End of modal

  /////////////////
  const handleHeaderRenameClick = (e: React.MouseEvent) => {
    // Swap name with textarea
    if (cardHeaderInput.current) {
      cardHeaderInput.current.value = name;
    }

    setIsTitleVisible(false);
    cardHeaderInput.current && cardHeaderInput.current.focus();
  }

  const handleHeaderRename = () => {
    const name = cardHeaderInput.current && cardHeaderInput.current.value

    dispatch(actions.cards.updateCard({id: id, name: name, details: details, listId: listId}))
    setIsTitleVisible(true);
  }

  ///////////////

  const handleDetailsUpdateClick = (e: React.MouseEvent) => {
    // Swap details with textarea
    if (cardDetailsInput.current) {
      cardDetailsInput.current.value = details;
    }

    setIsDetailsVisible(false);
    cardDetailsInput.current && cardDetailsInput.current.focus();
  }

  const handleDetailsUpdate = () => {
    const details = cardDetailsInput.current && cardDetailsInput.current.value

    dispatch(actions.cards.updateCard({id: id, name: name, details: details, listId: listId}))
    setIsDetailsVisible(true);
  }

  ////////////

  const handleSendCommentClick = () => {
    const comment = cardCommentInput.current && cardCommentInput.current.value

    if (!comment || comment === '') return false;

    dispatch(actions.comments.addComment({cardId: id, text: comment, author: 'Anon'}))
    if (cardCommentInput.current) cardCommentInput.current.value = '';
  }

  const onClick = () => {
    openModal();
  }

  return(
    <div className={styles.wrapper}>
        <div className={styles.listCard} onClick={onClick}>
          {name}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button onClick={closeModal}>close</button>
          <div className={styles.headerBlock}>
            <div>Task:</div>
            <textarea 
              className={`${styles.cardHeaderTextarea}` + (isTitleVisible ? ` ${styles.isHidden}` : '') } 
              ref={cardHeaderInput} 
              onBlur={handleHeaderRename}
            >
            </textarea>  
            <div className={`${styles.cardHeader}` + (!isTitleVisible ? ` ${styles.isHidden}` : '')}  onClick={handleHeaderRenameClick}>
              {name}
            </div>
          </div>
          <div className={styles.detailsBlock}>
            <div>Details:</div>
            <textarea 
              className={`${styles.cardHeaderTextarea}` + (isDetailsVisible ? ` ${styles.isHidden}` : '') } 
              ref={cardDetailsInput} 
              onBlur={handleDetailsUpdate}
            >
            </textarea>  
            <div className={`${styles.cardDetails}` + (!isDetailsVisible ? ` ${styles.isHidden}` : '')}  onClick={handleDetailsUpdateClick}>
              {details}
            </div>
          </div>
          <div className={styles.commentsBlock}>
            <div>Comments:</div>
            <div>
              {commentList} 
            </div>
            <div>
              <textarea 
                className={`${styles.cardCommentTextarea}`} 
                ref={cardCommentInput} 
                onBlur={handleDetailsUpdate}
              ></textarea>
            </div>
            <button onClick={handleSendCommentClick}>Send comment</button>
          </div>
        </Modal>
      </div>
  )
}

export default Card;