import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { PDFParse } from 'pdf-parse'

import { saveMeetingMinutes } from '@/lib/upload'

const divisionMeetingMinutesCategoryId = 3

async function getMinutesUrls(): Promise<string[]> {
    const minutesPage =
        'https://chalmers.it/pages/documents/student-division-meeting-minutes'
    const pattern = /https:\/\/chalmers\.it\/api\/media\/[a-zA-Z0-9_-]+/g
    const content = await fetch(minutesPage).then(response => response.text())
    const matches = content.matchAll(pattern)
    return [...matches.map(match => match[0])]
}

async function processMinutesUrl(url: string): Promise<void> {
    const blob = await fetch(url).then(response => response.blob())
    const file = new File([blob], 'minutes.pdf', { type: 'application/pdf' })
    const meetingDate = await extractMeetingDate(await blob.bytes())
    if (!meetingDate) {
        throw new Error(
            `Unable to find meeting date for meeting minutes at ${url}`
        )
    }
    try {
        await saveMeetingMinutes(
            file,
            divisionMeetingMinutesCategoryId,
            meetingDate
        )
    } catch (error: unknown) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            console.log(`Already added meeting ${meetingDate.toISOString()}`)
        } else {
            throw error
        }
    }
}

async function extractMeetingDate(
    bytes: Uint8Array<ArrayBuffer>
): Promise<Date | null> {
    const parser = new PDFParse({ data: bytes })
    const result = await parser.getText()
    const lines = result.pages.flatMap(page => page.text.split('\n'))

    const datePattern = /\d{4}[- ]\d{2}[- ]\d{2}/
    const timePattern = /\d{2}:\d{2}/

    let line = lines.find(
        line => datePattern.test(line) && timePattern.test(line)
    )
    console.log('Line with date and time:', line)
    if (!line) {
        line = lines.find(line => datePattern.test(line))
        console.log('Line with date only:', line)
    }
    if (!line) {
        return null
    }

    const dateMatch = line.match(datePattern)!
    const timeMatch = line.match(timePattern)

    const date = new Date(
        dateMatch[0].replace(' ', '-') + ' ' + (timeMatch?.[0] ?? '')
    )
    if (isNaN(date.getTime())) {
        return null
    }
    return date
}

async function main(): Promise<void> {
    const urls = await getMinutesUrls()
    for (const url of urls) {
        await processMinutesUrl(url)
    }
}

await main()
