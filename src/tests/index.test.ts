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

import {ECGDistance, ECGDistanceUnit, ECGPoint} from "../index"

describe("Geo Points", () => {

	test("Distance Between Two Points", () => {

		const p1: ECGPoint = new ECGPoint(29.7761, -95.1147);
		const p2: ECGPoint = new ECGPoint(19.4006, -99.0148);

		const allowedError: ECGDistance = new ECGDistance(0.5, ECGDistanceUnit.Miles);
		const actual: ECGDistance = new ECGDistance(757, ECGDistanceUnit.Miles);

		const d: ECGDistance = p1.distanceToPoint(p2);
		const distance: number = d.distance;
		const difference: number = Math.abs(distance - actual.toMiles().distance);
		expect(difference).toBeLessThan(allowedError.toMiles().distance);


	});

});

describe("Unit Converters", () => {

	describe("Inch Base", () => {

		test("in to ft", () => {

			const d: ECGDistance = new ECGDistance(18, ECGDistanceUnit.Inches).toFeet();
			expect(d.distance).toBe(1.5);
			expect(d.unit).toBe(ECGDistanceUnit.Feet);

		});

		test("in to mi", () => {

			const d: ECGDistance = new ECGDistance(69696, ECGDistanceUnit.Inches).toMiles();
			expect(d.distance).toBe(1.1);
			expect(d.unit).toBe(ECGDistanceUnit.Miles);

		});

	});

	describe("Feet Base", () => {

		test("ft to in", () => {

			const d: ECGDistance = new ECGDistance(2, ECGDistanceUnit.Feet).toInches();

			expect(d.distance).toBe(24);
			expect(d.unit).toBe(ECGDistanceUnit.Inches);

		});

		test("ft to mi", () => {

			const d: ECGDistance = new ECGDistance(5808, ECGDistanceUnit.Feet).toMiles();
			expect(d.distance).toBe(1.1);
			expect(d.unit).toBe(ECGDistanceUnit.Miles);

		});

	});

	describe("Mile Base", () => {

		test("mi to in", () => {

			const d: ECGDistance = new ECGDistance(2, ECGDistanceUnit.Miles).toInches();

			expect(d.distance).toBe(126720);
			expect(d.unit).toBe(ECGDistanceUnit.Inches);

		});

		test("mi to ft", () => {

			const d: ECGDistance = new ECGDistance(2, ECGDistanceUnit.Miles).toFeet();
			expect(d.distance).toBe(10560);
			expect(d.unit).toBe(ECGDistanceUnit.Feet);

		});

	});

});

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

			const d: ECGDistance = new ECGDistance(0.0001, ECGDistanceUnit.Miles).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Inches);

		});

		test("Move to Feet", () => {

			const d: ECGDistance = new ECGDistance(0.099, ECGDistanceUnit.Miles).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Feet);

		});

		test("Stay Same", () => {

			const d: ECGDistance = new ECGDistance(12, ECGDistanceUnit.Miles).smartConvert();
			expect(d.unit).toEqual(ECGDistanceUnit.Miles);

		});

	});


});