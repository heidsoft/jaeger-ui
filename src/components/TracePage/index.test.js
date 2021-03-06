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

import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import traceGenerator from '../../demo/trace-generators';
import TracePage from './';
import TracePageHeader from './TracePageHeader';
import TraceSpanGraph from './TraceSpanGraph';
import { transformTrace } from './TraceTimelineViewer/transforms';

describe('<TracePage>', () => {
  const trace = traceGenerator.trace({});
  const defaultProps = {
    trace,
    fetchTrace() {},
    id: trace.traceID,
    xformedTrace: transformTrace(trace),
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TracePage {...defaultProps} />);
  });

  it('renders a <TracePageHeader>', () => {
    expect(wrapper.find(TracePageHeader).get(0)).toBeTruthy();
  });

  it('renders a <TraceSpanGraph>', () => {
    const props = { trace: defaultProps.trace, xformedTrace: defaultProps.xformedTrace };
    expect(wrapper.contains(<TraceSpanGraph {...props} />)).toBeTruthy();
  });

  it('renders an empty page when not provided a trace', () => {
    wrapper = shallow(<TracePage {...defaultProps} trace={null} />);
    const isEmpty = wrapper.matchesElement(<section />);
    expect(isEmpty).toBe(true);
  });

  // can't do mount tests in standard tape run.
  it('fetches the trace if necessary', () => {
    const fetchTrace = sinon.spy();
    wrapper = mount(<TracePage {...defaultProps} trace={null} fetchTrace={fetchTrace} />);
    expect(fetchTrace.called).toBeTruthy();
    expect(fetchTrace.calledWith(trace.traceID)).toBe(true);
  });

  it("doesn't fetch the trace if already present", () => {
    const fetchTrace = sinon.spy();
    wrapper = shallow(<TracePage {...defaultProps} fetchTrace={fetchTrace} />);
    wrapper.instance().componentDidMount();
    expect(fetchTrace.called).toBeFalsy();
  });
});
