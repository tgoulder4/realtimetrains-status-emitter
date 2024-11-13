
import * as React from "react";
import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,

} from "@react-email/components";
import { mainFont } from '@/lib/fonts';

/**
 * 
 * @param children Children MUST be from type @react-email/components not reactNode
 */
export function AppEmailTemplate({ title, footerText, bodyText, children }: { title: string, footerText?: string, bodyText: string, children?: React.ReactNode }) {
    return <Html>
        <Head />
        <Preview>{title}</Preview>
        <Tailwind>
            <Body style={{ fontFamily: mainFont.style.fontFamily }} className='w-full max-w-[37.5em] bg-white flex flex-col'>
                <Section className='grid place-items-center py-4 border-b-2'><Text className='font-[800] text-xl tracking-[-1px]'>{title}</Text></Section>
                <Container>
                    <Section className='p-8'>{bodyText}</Section>
                    {footerText && <Section className='p-8 border-2 grid place-items-center'>{footerText}</Section>}
                </Container>
            </Body>
        </Tailwind>
    </Html>
}