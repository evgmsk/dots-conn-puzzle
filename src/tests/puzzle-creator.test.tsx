import React from 'react';
import { render, screen } from '@testing-library/react';
import PuzzleCreator from '../puzzle-components/creator-components/PuzzleCreator';

test('renders puzzle creator', () => {
    render(<PuzzleCreator />);
    expect(screen.getAllByRole('button').length).toEqual(13)
});
