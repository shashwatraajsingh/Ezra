"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
    {
        name: "Starter",
        description:
            "Great for small businesses and startups looking to get started with AI",
        price: 12,
        yearlyPrice: 99,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        features: [
            { text: "Up to 10 boards per workspace", icon: <Briefcase size={20} /> },
            { text: "Up to 10GB storage", icon: <Database size={20} /> },
            { text: "Limited analytics", icon: <Server size={20} /> },
        ],
        includes: [
            "Free includes:",
            "Unlimted Cards",
            "Custom background & stickers",
            "2-factor authentication",
        ],
    },
    {
        name: "Business",
        description:
            "Best value for growing businesses that need more advanced features",
        price: 48,
        yearlyPrice: 399,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        features: [
            { text: "Unlimted boards", icon: <Briefcase size={20} /> },
            { text: "Storage (250MB/file)", icon: <Database size={20} /> },
            { text: "100 workspace command runs", icon: <Server size={20} /> },
        ],
        includes: [
            "Everything in Starter, plus:",
            "Advanced checklists",
            "Custom fields",
            "Serverless functions",
        ],
    },
    {
        name: "Enterprise",
        description:
            "Advanced plan with enhanced security and unlimited access for large teams",
        price: 96,
        yearlyPrice: 899,
        popular: true,
        buttonText: "Get started",
        buttonVariant: "default" as const,
        features: [
            { text: "Unlimited board", icon: <Briefcase size={20} /> },
            { text: "Unlimited storage ", icon: <Database size={20} /> },
            { text: "Unlimited workspaces", icon: <Server size={20} /> },
        ],
        includes: [
            "Everything in Business, plus:",
            "Multi-board management",
            "Multi-board guest",
            "Attachment permissions",
        ],
    },
];

const PricingSwitch = ({
    onSwitch,
    className,
}: {
    onSwitch: (value: string) => void;
    className?: string;
}) => {
    const [selected, setSelected] = useState("0");

    const handleSwitch = (value: string) => {
        setSelected(value);
        onSwitch(value);
    };

    return (
        <div className={cn("flex justify-center", className)}>
            {/* Dark glassmorphic toggle — matches hero card style */}
            <div className="relative z-10 mx-auto flex w-fit rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1">
                <button
                    onClick={() => handleSwitch("0")}
                    className={cn(
                        "relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "0"
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-200",
                    )}
                >
                    {selected === "0" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border border-white/20 bg-white/10 shadow-inner"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative">Monthly</span>
                </button>

                <button
                    onClick={() => handleSwitch("1")}
                    className={cn(
                        "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "1"
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-200",
                    )}
                >
                    {selected === "1" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border border-white/20 bg-white/10 shadow-inner"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative flex items-center gap-2">
                        Yearly
                        <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-xs font-medium text-zinc-300">
                            Save 20%
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default function PricingSection4() {
    const [isYearly, setIsYearly] = useState(false);
    const pricingRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.4,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    const togglePricingPeriod = (value: string) =>
        setIsYearly(Number.parseInt(value) === 1);

    return (
        <div
            className="relative px-4 pt-20 min-h-screen max-w-7xl mx-auto"
            ref={pricingRef}
        >

            <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between">
                <div className="text-left mb-6">
                    {/* Heading — white on dark */}
                    <h2 className="text-4xl font-medium leading-[130%] text-white mb-4">
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            containerClassName="justify-start"
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 40,
                                delay: 0,
                            }}
                        >
                            Plans & Pricing
                        </VerticalCutReveal>
                    </h2>

                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="text-zinc-400 w-[80%]"
                    >
                        Trusted by millions, We help teams all around the world, Explore
                        which option is right for you.
                    </TimelineContent>
                </div>

                <TimelineContent
                    as="div"
                    animationNum={1}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                >
                    <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
                </TimelineContent>
            </article>

            {/* Cards grid — dark glassmorphic background */}
            <TimelineContent
                as="div"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="grid md:grid-cols-3 gap-4 mx-auto bg-white/5 backdrop-blur-sm border border-white/10 sm:p-3 rounded-lg"
            >
                {plans.map((plan, index) => (
                    <TimelineContent
                        as="div"
                        key={plan.name}
                        animationNum={index + 3}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                    >
                        <Card
                            className={`relative flex-col flex justify-between ${plan.popular
                                ? "scale-110 ring-2 ring-white/30 bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl"
                                : "border border-white/10 bg-white/5 backdrop-blur-md pt-4 text-white shadow-none"
                                }`}
                        >
                            <CardContent className="pt-0">
                                <div className="space-y-2 pb-3">
                                    {plan.popular && (
                                        <div className="pt-4">
                                            <span className="bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                                Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-semibold text-white">
                                            $
                                            <NumberFlow
                                                format={{ currency: "USD" }}
                                                value={isYearly ? plan.yearlyPrice : plan.price}
                                                className="text-4xl font-semibold"
                                            />
                                        </span>
                                        <span className="text-zinc-400 ml-1">
                                            /{isYearly ? "year" : "month"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <h3 className="text-3xl font-semibold mb-2 text-white">
                                        {plan.name}
                                    </h3>
                                </div>
                                <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <h4 className="font-medium text-base mb-3 text-zinc-300">
                                        {plan.includes[0]}
                                    </h4>
                                    <ul className="space-y-2 font-semibold">
                                        {plan.includes.slice(1).map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <span className="text-white h-6 w-6 bg-white/10 border border-white/20 rounded-full grid place-content-center mt-0.5 mr-3">
                                                    <CheckCheck className="h-4 w-4" />
                                                </span>
                                                <span className="text-sm text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <button
                                    className={`w-full mb-6 p-4 text-xl rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.popular
                                        ? "bg-white font-semibold shadow-lg shadow-white/20 border border-white/30 text-zinc-950 hover:bg-zinc-100"
                                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </CardFooter>
                        </Card>
                    </TimelineContent>
                ))}
            </TimelineContent>
        </div>
    );
}
