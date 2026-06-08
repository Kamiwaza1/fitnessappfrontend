import Image from "next/image";
import Link from "next/link";
import logo from "@/images/dark_lift_top_logo.png";

export default function LandingHero() {
  return (
    <section className="flex min-h-screen items-center gap-16 px-16 max-[900px]:flex-col max-[900px]:justify-center max-[900px]:gap-8 max-[900px]:px-6 max-[900px]:py-16 max-[900px]:text-center">
      <div className="flex basis-[768px] items-center justify-center max-[900px]:basis-auto">
        <Image
          src={logo}
          alt="Dark Lift Logo"
          className="h-auto w-[768px] object-contain max-[900px]:w-[min(70vw,320px)]"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-8 max-[900px]:items-center">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground max-[900px]:text-[1.75rem] max-[900px]:leading-[1.3]">
          Welcome to Dark Lift - Your Ultimate Fitness Companion!
        </h1>
        <p className="text-lg leading-8 text-primary/70 max-[900px]:text-base max-[900px]:leading-[1.7]">
          Get ready to elevate your fitness journey with personalized workout plans, nutrition
          tracking, and progress monitoring.
        </p>
        <Link
          href="/login"
          className="flex h-12 w-48 items-center justify-center rounded-full bg-primary text-sm font-bold tracking-[0.05em] text-background transition-opacity hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
