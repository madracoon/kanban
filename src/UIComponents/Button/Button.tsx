import React from 'react'
import styles from './button.module.scss'

function Button(props: any) {
  const { text, onclick, style } = props;

  return(
    <button className={styles.button} style={style} onClick={onclick}>{text}</button>
  )
}

export default Button;