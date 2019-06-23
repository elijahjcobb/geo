/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 *
 * Copyright 2019 Elijah Cobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import {ECGDistance, ECGDistanceUnit} from "../index"

describe("Smart Unit Converter", () => {

	describe("Inch Base", () => {


		test("Stay Same", () => {

			const d: ECGDistance = new ECGDistance(11, ECGDistanceUnit.Inches).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Inches);

		});

		test("Move to Feet", () => {

			const d: ECGDistance = new ECGDistance(12, ECGDistanceUnit.Inches).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Feet);

		});

		test("Move to Miles", () => {

			const d: ECGDistance = new ECGDistance(15840, ECGDistanceUnit.Inches).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Miles);

		});

	});


	describe("Feet Base", () => {

		test("Move to Inch", () => {

			const d: ECGDistance = new ECGDistance(0.812, ECGDistanceUnit.Feet).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Inches);

		});

		test("Stay Same", () => {

			const d: ECGDistance = new ECGDistance(100, ECGDistanceUnit.Feet).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Feet);

		});

		test("Move to Mile", () => {

			const d: ECGDistance = new ECGDistance(1320, ECGDistanceUnit.Feet).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Miles);

		});

	});

	describe("Mile Base", () => {

		test("Move to Inch", () => {

			const d: ECGDistance = new ECGDistance(0.001, ECGDistanceUnit.Miles).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Inches);

		});

		test("Move to Feet", () => {

			const d: ECGDistance = new ECGDistance(0.099, ECGDistanceUnit.Miles).smartConvert();
			console.log(d);
			expect(d.unit).toEqual(ECGDistanceUnit.Feet);

		});

		test("Stay Same", () => {

			const d: ECGDistance = new ECGDistance(12, ECGDistanceUnit.Miles).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Miles);

		});

	});


});