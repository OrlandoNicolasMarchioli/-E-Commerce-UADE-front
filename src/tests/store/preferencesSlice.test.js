import { describe, expect, it } from 'vitest';
import reducer, { selectTheme, setTheme, toggleTheme } from '../../store/preferencesSlice';
import searchReducer, { clearLastQuery, MAX_QUERY_LENGTH, selectLastQuery, setLastQuery }
  from '../../store/searchSlice';

describe('preferencesSlice', () => {
  it('arranca en tema claro', () => {
    expect(selectTheme({ preferences: reducer(undefined, { type: '@@init' }) })).toBe('light');
  });

  it('toggleTheme alterna entre claro y oscuro', () => {
    const dark = reducer({ theme: 'light' }, toggleTheme());
    expect(dark.theme).toBe('dark');
    expect(reducer(dark, toggleTheme()).theme).toBe('light');
  });

  it('setTheme acepta solo temas conocidos', () => {
    expect(reducer({ theme: 'light' }, setTheme('dark')).theme).toBe('dark');
    expect(reducer({ theme: 'light' }, setTheme('<script>')).theme).toBe('light');
  });
});

describe('searchSlice', () => {
  it('guarda la búsqueda sin espacios de más', () => {
    const state = searchReducer(undefined, setLastQuery('  notebook  '));
    expect(selectLastQuery({ search: state })).toBe('notebook');
  });

  it('recorta búsquedas muy largas y acepta vacío', () => {
    expect(searchReducer(undefined, setLastQuery('a'.repeat(500))).lastQuery).toHaveLength(MAX_QUERY_LENGTH);
    expect(searchReducer(undefined, setLastQuery(undefined)).lastQuery).toBe('');
  });

  it('clearLastQuery la borra', () => {
    expect(searchReducer({ lastQuery: 'lapicera' }, clearLastQuery()).lastQuery).toBe('');
  });
});
