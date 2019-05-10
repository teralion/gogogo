import React, {
  Fragment,
  useState,
  useEffect,
} from 'react';
import T from 'prop-types';
import cloneDeep from 'lodash.clonedeep';

import CatalogButton from 'app/components/CatalogButton';
import ItemsCarousel from 'app/components/ItemsCarousel';

import { MIN_GUESTS, FIRST_GUEST } from 'app/pages/Main';
import items, { meta } from 'helpers/data';
import moment from 'helpers/moment';

import cx from 'classnames';
import css from './index.styl';

function toggleInput(value, toggler) {
  return function updater() {
    toggler(!value);
  };
}

function getItems(type, state, props) {
  const { day, guest, order } = props;

  const dayWeek = moment(day).format('e');

  return (items[type] || []).map((item) => {
    if (!item.dayWeeks.includes(Number(dayWeek))) {
      return false;
    }

    let countInCart = 0;
    let optionId = null;
    if (order[guest]) {
      const itemInCart = order[guest].find(
        v => v.id === item.id,
      );
      if (itemInCart) {
        /* eslint-disable-next-line prefer-destructuring */
        countInCart = itemInCart.countInCart;
        /* eslint-disable-next-line prefer-destructuring */
        optionId = itemInCart.optionId;
      }
    }

    return {
      ...item,
      optionId,
      countInCart,
    };
  }).filter(Boolean);
}

function updateOrder(state, props, rest) {
  return function updateOrderValues(params) {
    const { guest, order, handleOrder } = props;
    const { label: parentLabel } = rest;
    const {
      id,
      amount,
      optionId,
      label: childLabel,
    } = params;

    const label = parentLabel || childLabel || '';
    const nextOrder = cloneDeep(order);
    if (!nextOrder[guest]) {
      nextOrder[guest] = [];
    }

    const nextOptionId = optionId || null;

    let itemIndex;
    const item = nextOrder[guest].find((v, i) => {
      if (v.id === id) itemIndex = i;
      return v.id === id;
    });

    if (!item && amount > 0) {
      nextOrder[guest].push({
        id,
        label,
        countInCart: amount,
        optionId: nextOptionId,
      });
    } else if (item) {
      item.countInCart = amount;
      item.optionId = nextOptionId;
      item.label = label;
    }

    if (
      amount === 0
      && typeof itemIndex === 'number'
    ) {
      nextOrder[guest].splice(itemIndex, 1);
    }

    if (nextOrder[guest].length === 0) {
      delete nextOrder[guest];
    }

    handleOrder(nextOrder);
  };
}

function renderSections(state, props) {
  const { guest, day } = props;
  const labels = Object.keys(items);

  return labels.map((label) => {
    const openState = state[`${label}SectionIsOpen`];
    const toggler = state[`${label}SectionToggle`];
    const classImg = css[`${label}Img`];
    const { name } = meta[label];

    return (
      <Fragment key={label}>
        <CatalogButton
          className={cx(classImg, css.section)}
          label={name}
          isOpen={openState}
          onClick={toggleInput(openState, toggler)}
        />
        <ItemsCarousel
          key={`guest-${guest}-day-${day}`}
          name={label}
          items={getItems(label, state, props)}
          updateOrder={updateOrder(
            state,
            props,
            { label },
          )}
          slideClassName={css.ease}
          className={cx(
            css.section,
            css.transition,
            { [css.transitionClose]: !openState },
          )}
        />
      </Fragment>
    );
  });
}

function clearGuests(state, props) {
  const { guests, order, handleOrder } = props;

  const nextOrder = {};
  const reservedGuests = Object.keys(order);
  reservedGuests.forEach((guestNum) => {
    if (guestNum <= guests) {
      nextOrder[guestNum] = order[guestNum];
    }
  });

  handleOrder(cloneDeep(nextOrder));
}

export default function CatalogSection(props) {
  const { guests } = props;
  const [
    soupsSectionIsOpen,
    soupsSectionToggle,
  ] = useState(false);
  const [
    mainSectionIsOpen,
    mainSectionToggle,
  ] = useState(false);
  const [
    trimmingsSectionIsOpen,
    trimmingsSectionToggle,
  ] = useState(false);
  const [
    saladsSectionIsOpen,
    saladsSectionToggle,
  ] = useState(false);
  const [
    supplementsSectionIsOpen,
    supplementsSectionToggle,
  ] = useState(false);

  const state = {
    soupsSectionIsOpen,
    soupsSectionToggle,
    mainSectionIsOpen,
    mainSectionToggle,
    trimmingsSectionIsOpen,
    trimmingsSectionToggle,
    saladsSectionIsOpen,
    saladsSectionToggle,
    supplementsSectionIsOpen,
    supplementsSectionToggle,
  };

  useEffect(() => {
    clearGuests(state, props);
  }, [guests]);

  return renderSections(state, props);
}

/* eslint-disable */
CatalogSection.propTypes = {
  className: T.string,
  day: T.string,
  guest: T.number,
  guests: T.number,
  order: T.object,
  handleOrder: T.func,
}
CatalogSection.defaultProps = {
  className: '',
  day: '',
  guest: FIRST_GUEST,
  guests: MIN_GUESTS,
  order: {},
  handleOrder: () => {},
}
/* eslint-enable */
