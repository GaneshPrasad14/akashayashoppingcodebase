import SectionHeader from "@/components/ui/SectionHeader";

const Terms = () => {
    return (
        <main className="min-h-screen py-16 md:py-24 bg-background">
            <div className="container max-w-4xl">
                <SectionHeader title="Terms & Conditions" subtitle="Last updated: January 2026" />

                <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
                        <p>
                            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Akshaya Shopping (“we,” “us” or “our”), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">3. User Representations</h2>
                        <p>
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">4. Products</h2>
                        <p>
                            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">5. Purchases and Payment</h2>
                        <p>
                            We accept the following forms of payment: Razorpay (Online Payment) and Cash on Delivery. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">6. Return Policy</h2>
                        <p>
                            Please review our Return Policy posted on the Site prior to making any purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                        </p>
                        <div className="mt-2 p-4 bg-secondary/20 rounded-lg">
                            <p><strong>Email:</strong> support@akshayashopping.com</p>
                            <p><strong>Phone:</strong> +91 99999 99999</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Terms;
