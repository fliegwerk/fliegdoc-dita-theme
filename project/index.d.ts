/*!
 * MIT License
 *
 * Copyright (c) 2021 WüSpace e. V.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Lorem Ipsum dolor sit amet
 *
 * @param test - a description for test
 * @throws TypeError - if called outside of the
 *
 * @example
 * ```ts
 * function AppLogo() {
 * 	const appLogo = useLogo();
 * 	return <Image src={appLogo} alt="Application logo" />;
 * }
 * ```
 */
declare function useTest(test: string): string;

declare type NavBarKey = string;

declare const ConstString: string;

export declare interface TestInterface {
	title: string;
	path: NavBarKey;
}

/**
 * A test class
 */
export declare class TestClass {
	public publicProp: string;
	protected protectedProp: string;
	private privateProp: string;

	static staticProp: string;

	constructor(test: string);
	constructor(abc: string);

	/**
	 * @returns A `string` which I _can't_ **describe** to any more detail
	 * @private
	 */
	public publicMethod(): string;

	static staticMethod(): void;
}

/**
 * Lorem Ipsum Dolor Sit amet
 *
 * @see {@link useTest}
 */
export interface AnotherInterface extends TestInterface, TestClass {
	/**
	 * An interface array
	 *
	 * @see {@link TestInterface}
	 */
	arrayProp?: Array<AnotherInterface>;
}

declare class ComplexClass<T extends AnotherInterface = AnotherInterface>
	extends TestClass
	implements AnotherInterface {
	arrayProp: Array<AnotherInterface>;
	path: NavBarKey;
	title: string;
}
