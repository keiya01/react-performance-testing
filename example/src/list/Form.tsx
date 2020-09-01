import React from 'react';

interface Props {
  /**
   * @description
   * You need to get form value from FormData
   */
  onSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

export const Form = ({ onSubmit }: Props): React.ReactElement => {
  return (
    <form onSubmit={onSubmit}>
      <input name="message" />
    </form>
  );
};
