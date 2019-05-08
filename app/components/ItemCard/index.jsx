import React, { useState } from 'react';
import T from 'prop-types';

import ModalWrap from 'app/elements/ModalWrap';
import Counter from 'app/elements/Counter';

import isServer from 'helpers/isServer';

import cx from 'classnames';
import css from './index.styl';

function touchElem(elem, className) {
  elem.classList.add(className);
  setTimeout(() => {
    elem.classList.remove(className);
  }, 300);
}

function handleCountChange(nextValue, state, props) {
  const { id, addToCart } = props;
  const { countToAdd, updateCount } = state;

  if (isServer) return;

  const elem = document.getElementById(`item-${id}`);
  if (elem) {
    if (nextValue > countToAdd) {
      touchElem(elem, css.inc);
    } else {
      touchElem(elem, css.dec);
    }
  }

  if (nextValue === 0) {
    addToCart(id, 0);
  }

  return updateCount(nextValue);
}

function updateCart(state, props) {
  const { countToAdd, updateCount } = state;
  const { id, addToCart } = props;

  if (countToAdd === 0) {
    updateCount(1);
  }

  addToCart(id, countToAdd > 0 ? countToAdd : 1);
}

export default function ItemCard(props) {
  const {
    id,
    url,
    title,
    piece,
    entity,
    price,
    countInCart,
    className,
  } = props;

  const [countToAdd, updateCount] = useState(countInCart);
  const [isOpen, handleOpen] = useState(false);
  const state = {
    countToAdd,
    updateCount,
  };

  return (
    <div
      id={`item-${id}`}
      className={cx(className, css.card,
        { [css.toAdd]: countToAdd > 0 })
      }
    >
      {/* eslint-disable-next-line */}
      <img
        src={url}
        alt={title}
        className={css.image}
        onClick={() => handleOpen(!isOpen)}
      />

      <div className={css.content}>
        {/* eslint-disable-next-line */}
        <span
          className={css.title}
          onClick={() => handleOpen(!isOpen)}
        >
          { title }
        </span>

        <div className={css.amount}>
          <span className={css.piece}>
            { `${piece} ${entity} /`}
          </span>
          <span className={css.price}>
            { `${price} р.` }
          </span>
        </div>

        <Counter
          className={css.counter}
          inputClassName={css.input}
          buttonClassName={css.buttons}
          value={countToAdd}
          handleChange={nextValue => (
            handleCountChange(nextValue, state, props)
          )}
        />

        <button
          type="button"
          onClick={() => updateCart(state, props)}
          className={cx(
            css.addToCartButton,
            { [css.shouldUpdate]: countInCart !== countToAdd },
          )}
        >
          В корзину!
        </button>
      </div>

      {isOpen && (
        <ModalWrap
          id={`item-${id}`}
          handleOpen={() => handleOpen(!isOpen)}
        >
          hi there
        </ModalWrap>
      )}
    </div>
  );
}

/* eslint-disable */
ItemCard.propTypes = {
  title: T.string,
  url: T.string,
  id: T.number,
  piece: T.number,
  entity: T.string,
  price: T.number,
  className: T.string,
  countInCart: T.number,
  addToCart: T.func,
}
ItemCard.defaultProps = {
  title: '',
  url: '',
  id: undefined,
  piece: undefined,
  entity: 'шт.',
  price: undefined,
  className: '',
  countInCart: 0,
  addToCart: () => {},
}
/* eslint-enable */
