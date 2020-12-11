import React, { useRef, useState } from "react"
import styles from "./comment.module.scss"

interface Props {
  id: number,
  cardId: number,
  text: number,
  author?: string
}

function Comment(props: Props) {
  const { author, text } = props;

  return(
    <div className={styles.wrapper}>
      <div className={styles.author}>{author}</div>
      <div className={styles.text}>{text}</div>
    </div>
  )
}

export default Comment;