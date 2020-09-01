import React from 'react';

interface Props {
  item: string;
}

export const Item = React.memo(function Item({
  item,
}: Props): React.ReactElement {
  return <li>{item}</li>;
});
