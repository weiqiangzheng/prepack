/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow strict */

import type { BabelNodeSourceLocation } from "babel-types";

// Information: Just an informative message with no semantic implications whatsoever
// Warning: We came across something that has a well-defined meaning, but is likely to be wrong anyway.
// RecoverableError: Something is clearly wrong and we'd like you to know, but, by sprinkling in some well-meaning assumptions, we could carry on the analysis to possibly give you even more diagnostics.
// FatalError: Something is clearly wrong and we'd like you to know, and there is just nothing we can do about it, so we stop completely right there.
export type Severity = "FatalError" | "RecoverableError" | "Warning" | "Information";
export type ErrorHandlerResult = "Fail" | "Recover";
export type ErrorCode = "PP0001";

// This is the error format used to report errors to the caller-supplied
// error-handler
export class CompilerDiagnostic extends Error {
  constructor(message: string, location: ?BabelNodeSourceLocation, errorCode: string, severity: Severity) {
    super(message);

    this.location = location;
    this.severity = severity;
    this.errorCode = errorCode;
  }

  callStack: void | string;
  location: ?BabelNodeSourceLocation;
  severity: Severity;
  errorCode: string;
}

// This error is thrown to exit Prepack when an ErrorHandler returns 'FatalError'
// This should just be a class but Babel classes doesn't work with
// built-in super classes.
export class FatalError extends Error {
  constructor(message?: string) {
    super(message === undefined ? "A fatal error occurred while prepacking." : message);
  }
}

// This error is thrown when exploring a path whose entry conditon implies that an earlier path conditon must be false.
// Such paths are infeasible (dead) and must be elided from the evaluation.
export class InfeasiblePathError extends Error {
  constructor() {
    super("Infeasible path explored");
  }
}

export type ErrorHandler = (error: CompilerDiagnostic) => ErrorHandlerResult;
