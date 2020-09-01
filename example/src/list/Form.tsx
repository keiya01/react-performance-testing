import React from 'react';

interface Props {
  /**
   * @description
   * You need to get form value from FormData
   */
  onSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

export const Form = React.memo(
  function Form({ onSubmit }: Props): React.ReactElement {
    return (
      <form onSubmit={onSubmit}>
        <input name="message" />
        <button type="submit">submit</button>
      </form>
    );
  },
  (prevProps, nextProps) => prevProps.onSubmit === nextProps.onSubmit,
);
