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

	private toUnitSmart(distance: ECGDistance): ECGDistance {

		let downUnit: number = 0;
		let upUnit: number = 0;

		switch (distance.unit) {
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

		let unit: ECGDistanceUnit = distance.unit;

		if (distance.distance < downUnit && distance.unit > ECGDistanceUnit.Inches) return this.toUnitSmart(distance.toUnit(--unit));
		else if (distance.distance >= upUnit && distance.unit < ECGDistanceUnit.Miles) return this.toUnitSmart(distance.toUnit(++unit));
		else return distance;

	}

	public smartConvert(): ECGDistance {

		return this.toUnitSmart(this);

	}

	public toInches(): ECGDistance { return this.toUnit(ECGDistanceUnit.Inches); }
	public toFeet(): ECGDistance { return this.toUnit(ECGDistanceUnit.Feet); }
	public toMiles(): ECGDistance { return this.toUnit(ECGDistanceUnit.Miles); }

}

export const ECGConstants = {
	earthCircumference: new ECGDistance(24859.734, ECGDistanceUnit.Miles),
	earthRadius: new ECGDistance(3959, ECGDistanceUnit.Miles)
};

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
			lat: new ECGDistance(Math.abs(ECGConstants.earthCircumference.distance / 360), ECGDistanceUnit.Miles),
			lng: new ECGDistance(Math.abs((ECGConstants.earthCircumference.distance / 360) * Math.cos(this.lat)), ECGDistanceUnit.Miles)
		}

	}

	public distanceToPoint(point: ECGPoint): ECGDistance {

		let lat1: number = this.lat;
		let lon1: number = this.lng;
		let lat2: number = point.lat;
		let lon2: number = point.lng;

		let radiansLat1: number = Math.PI * lat1 / 180;
		let radiansLat2: number = Math.PI * lat2 / 180;
		let theta: number = lon1 - lon2;
		let radianTheta: number = Math.PI * theta/180;
		let dist: number = Math.sin(radiansLat1) * Math.sin(radiansLat2) + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.cos(radianTheta);
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		dist = dist * 0.6213712;

		return new ECGDistance(dist, ECGDistanceUnit.Miles);
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