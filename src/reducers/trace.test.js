// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as jaegerApiActions from '../../src/actions/jaeger-api';
import traceReducer from '../../src/reducers/trace';
import traceGenerator from '../../src/demo/trace-generators';

const generatedTrace = traceGenerator.trace({ numberOfSpans: 1 });
const { traceID } = generatedTrace;

it('trace reducer should set loading true on a fetch', () => {
  const state = traceReducer(undefined, {
    type: `${jaegerApiActions.fetchTrace}_PENDING`,
  });
  expect(state.loading).toBe(true);
});

it('trace reducer should handle a successful FETCH_TRACE', () => {
  const state = traceReducer(undefined, {
    type: `${jaegerApiActions.fetchTrace}_FULFILLED`,
    payload: { data: [generatedTrace] },
    meta: { id: traceID },
  });
  expect(state.traces).toEqual({ [traceID]: generatedTrace });
  expect(state.loading).toBe(false);
});

it('trace reducer should handle a failed FETCH_TRACE', () => {
  const error = new Error();
  const state = traceReducer(undefined, {
    type: `${jaegerApiActions.fetchTrace}_REJECTED`,
    payload: error,
    meta: { id: traceID },
  });
  expect(state.traces).toEqual({ [traceID]: error });
  expect(state.traces[traceID]).toBe(error);
  expect(state.loading).toBe(false);
});

it('trace reducer should handle a successful SEARCH_TRACES', () => {
  const state = traceReducer(undefined, {
    type: `${jaegerApiActions.searchTraces}_FULFILLED`,
    payload: { data: [generatedTrace] },
    meta: { query: 'whatever' },
  });
  expect(state.traces).toEqual({ [traceID]: generatedTrace });
  expect(state.loading).toBe(false);
});
