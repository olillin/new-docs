import Image from 'next/image'

export function PixelnHeart() {
    return (
        <Image
            src="/icons/pixelnheart.png"
            width="160"
            height="160"
            alt="pixelnheart"
            className="inline-block h-[1.5em] w-[1.5em] -translate-y-[0.1em]"
        />
    )
}
