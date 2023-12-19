import React from 'react'
import { createBoard } from '@wixc3/react-board';

export default createBoard({
    name: 'Welcome',
    Board: () => <div></div>,
    isSnippet: true,
});