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


export const ECGConstants = {
	earthCircumference: 24859.734
};

export enum ECGDistanceUnit {
	Inches,
	Feet,
	Miles
}

export class ECGDistance {

	public readonly distance: number;
	public readonly unit: ECGDistanceUnit;

	public constructor(distance: number, unit: ECGDistanceUnit) {

		this.distance = distance;
		this.unit = unit;

	}

	public toString(): string {

		let unitString: string;

		switch (this.unit) {
			case ECGDistanceUnit.Miles:
				unitString = "mi";
				break;
			case ECGDistanceUnit.Inches:
				unitString = "in";
				break;
			case ECGDistanceUnit.Feet:
				unitString = "ft";
				break;
			default:
				unitString = "";
				break;
		}

		return `${this.distance.toFixed(2)} ${unitString}`;

	}

	public print(): void {

		console.log(this.toString());

	}

	private conversionToUnit(unit: ECGDistanceUnit): number {

		switch (this.unit) {
			case ECGDistanceUnit.Feet:
				switch (unit) {
					case ECGDistanceUnit.Feet:
						return 1;
					case ECGDistanceUnit.Inches:
						return 12;
					case ECGDistanceUnit.Miles:
						return 1 / 5280;
					default:
						return 0;
				}
			case ECGDistanceUnit.Inches:
				switch (unit) {
					case ECGDistanceUnit.Feet:
						return 1 / 12;
					case ECGDistanceUnit.Inches:
						return 1;
					case ECGDistanceUnit.Miles:
						return 1 / 12 / 5280;
					default:
						return 0;
				}
			case ECGDistanceUnit.Miles:
				switch (unit) {
					case ECGDistanceUnit.Feet:
						return 5280;
					case ECGDistanceUnit.Inches:
						return 5280 * 12;
					case ECGDistanceUnit.Miles:
						return 1;
					default:
						return 0;
				}
			default:
				return 0;
		}

	}

	private toUnit(unit: ECGDistanceUnit): ECGDistance {

		return new ECGDistance(this.distance * this.conversionToUnit(unit), unit);

	}

	private toUnitSmart(passedUnit: ECGDistanceUnit): ECGDistanceUnit {

		let unit: ECGDistanceUnit = passedUnit;

		let downUnit: number = 0;
		let upUnit: number = 0;

		switch (unit) {
			case ECGDistanceUnit.Miles:
				downUnit = 0.1;
				break;
			case ECGDistanceUnit.Feet:
				downUnit = 1;
				upUnit = 1320;
				break;
			case ECGDistanceUnit.Inches:
				upUnit = 12;
				break;
		}

		if (this.distance <= downUnit && unit > ECGDistanceUnit.Inches) unit --;
		else if (this.distance >= upUnit && unit < ECGDistanceUnit.Miles) unit ++;

		return passedUnit === unit ? unit : this.toUnitSmart(unit);

	}

	public smartConvert(): ECGDistance {

		return this.toUnit(this.toUnitSmart(this.unit));

	}

	public toInches(): ECGDistance { return this.toUnit(ECGDistanceUnit.Inches); }
	public toFeet(): ECGDistance { return this.toUnit(ECGDistanceUnit.Feet); }
	public toMiles(): ECGDistance { return this.toUnit(ECGDistanceUnit.Miles); }

}

export class ECGBox {

	public readonly topLeft: ECGPoint;
	public readonly topRight: ECGPoint;
	public readonly bottomLeft: ECGPoint;
	public readonly bottomRight: ECGPoint;

	public constructor(topLeft: ECGPoint, topRight: ECGPoint, bottomLeft: ECGPoint, bottomRight: ECGPoint) {

		this.topLeft = topLeft;
		this.topRight = topRight;
		this.bottomLeft = bottomLeft;
		this.bottomRight = bottomRight;

	}

}

export type ECGLineDistances = { lat: ECGDistance, lng: ECGDistance };

export class ECGPoint {

	public readonly lat: number;
	public readonly lng: number;

	public constructor(lat: number, lng: number) {

		this.lat = lat;
		this.lng = lng;

	}

	public lineDistances(): ECGLineDistances {

		return {
			lat: new ECGDistance(Math.abs(ECGConstants.earthCircumference / 360), ECGDistanceUnit.Miles),
			lng: new ECGDistance(Math.abs((ECGConstants.earthCircumference / 360) * Math.cos(this.lat)), ECGDistanceUnit.Miles)
		}

	}

	public distanceToPoint(point: ECGPoint): ECGDistance {

		const lineDistance: ECGLineDistances = this.lineDistances();

		const latDiff: number = Math.abs(this.lat - point.lat);
		const latDistance: number = latDiff * lineDistance.lat.distance;

		const lngDiff: number = Math.abs(this.lng - point.lng);
		const lngDistance: number = lngDiff * lineDistance.lng.distance;
		const hypot: number = Math.sqrt(Math.pow(latDistance, 2) + Math.pow(lngDistance, 2));

		return new ECGDistance(hypot, ECGDistanceUnit.Miles);


	}

	public findBoxWithRadius(radius: ECGDistance): ECGBox {

		const lineDistances: ECGLineDistances = this.lineDistances();
		const latLineDistance: number = lineDistances.lat.toMiles().distance;
		const lngLineDistance: number = lineDistances.lng.toMiles().distance;
		const fixedRadius: number = radius.toMiles().distance;

		const lat: number = fixedRadius / latLineDistance;
		const lng: number = fixedRadius / lngLineDistance;

		const p1: ECGPoint = new ECGPoint(this.lat + lat, this.lng - lng);
		const p2: ECGPoint = new ECGPoint(this.lat + lat, this.lng + lng);
		const p3: ECGPoint = new ECGPoint(this.lat - lat, this.lng + lng);
		const p4: ECGPoint = new ECGPoint(this.lat - lat, this.lng - lng);

		return new ECGBox(p1, p2, p3, p4);

	}

}