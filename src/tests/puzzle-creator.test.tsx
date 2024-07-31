import React from 'react';
import { render, screen } from '@testing-library/react';
import PuzzleCreator from '../puzzle-components/creator-components/PuzzleCreator';
import {copyObj} from "../utils/helper-fn";

test('renders puzzle creator', () => {
    render(<PuzzleCreator />);
    expect(screen.getAllByRole('button').length).toEqual(13)
});

test('', () => {
    const obj = {a: [{a:3, b: [{q: 1}, {l: 4}, {w: 4}]}], s: 2}

    const obj2 = copyObj(obj)
    expect(obj2).toEqual(obj)
    obj2.a[0].a = 5
    expect(obj.a[0].a).toBe(3)
})
