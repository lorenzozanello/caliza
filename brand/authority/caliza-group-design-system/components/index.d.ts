import type * as React from 'react';

export type Brand = 'stone-design' | 'living-design' | 'stone-care';

export interface WordmarkProps { variant?: 'auto' | 'principal' | 'inversa' | 'monocroma'; size?: number; rule?: boolean; className?: string; style?: React.CSSProperties }
export declare function Wordmark(props: WordmarkProps): React.ReactElement;

export interface BrandSymbolProps { brand: Brand; size?: number; title?: string; className?: string; style?: React.CSSProperties }
export declare function BrandSymbol(props: BrandSymbolProps): React.ReactElement;

export interface SubBrandLockupProps { brand: Brand; size?: number; tone?: 'auto' | 'inversa'; symbol?: boolean; className?: string; style?: React.CSSProperties }
export declare function SubBrandLockup(props: SubBrandLockupProps): React.ReactElement;

export interface SectionTitleProps { children: React.ReactNode; as?: 'h1' | 'h2' | 'h3' | 'h4'; className?: string }
export declare function SectionTitle(props: SectionTitleProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'link' | 'onimage'; href?: string }
export declare function Button(props: ButtonProps): React.ReactElement;

export interface ImageCardProps { src: string; alt?: string; title: React.ReactNode; subtitle?: React.ReactNode; ratio?: string; className?: string; style?: React.CSSProperties }
export declare function ImageCard(props: ImageCardProps): React.ReactElement;

export interface ArchFrameProps { src: string; alt?: string; width?: number; ratio?: string; className?: string; style?: React.CSSProperties }
export declare function ArchFrame(props: ArchFrameProps): React.ReactElement;

export interface NavLink { label: string; href?: string; active?: boolean }
export interface NavBarProps { links: NavLink[]; homeHref?: string; label?: string; className?: string }
export declare function NavBar(props: NavBarProps): React.ReactElement;

export interface HeroProps { src: string; alt?: string; title: React.ReactNode; kicker?: string; text?: React.ReactNode; cta?: { label: string; href: string }; height?: number; className?: string; style?: React.CSSProperties }
export declare function Hero(props: HeroProps): React.ReactElement;

export interface SampleTagDetail { label: string; value: string }
export interface SampleTagProps { brand: Brand; name: string; details?: SampleTagDetail[]; code?: string; className?: string; style?: React.CSSProperties }
export declare function SampleTag(props: SampleTagProps): React.ReactElement;

declare global { interface Window { Caliza: { Wordmark: typeof Wordmark; BrandSymbol: typeof BrandSymbol; SubBrandLockup: typeof SubBrandLockup; SectionTitle: typeof SectionTitle; Button: typeof Button; ImageCard: typeof ImageCard; ArchFrame: typeof ArchFrame; NavBar: typeof NavBar; Hero: typeof Hero; SampleTag: typeof SampleTag } } }
