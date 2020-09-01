import React from 'react';
import { Item } from './Item';

interface Props {
  list: string[];
}

export const List = ({ list }: Props): React.ReactElement => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item} item={item} />
      ))}
    </ul>
  );
};
