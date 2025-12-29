import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

interface GoldWinner {
  _id: string;
  name: string;
  orderId: string;
  prize: string;
  prizeType: string;
  date: string;
  image: string;
  testimonial: string;
  isActive: boolean;
}

const GoldWinners = () => {
  const [mounted, setMounted] = useState(false);
  const [winners, setWinners] = useState<GoldWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchWinners();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const fetchWinners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/gold-winners`);
      const data = await response.json();
      if (data.success) {
        setWinners(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch winners:", error);
    } finally {
      setLoading(false);
    }
  };

  const firstPrizeWinner = winners.find(w => w.prizeType === "first");
  const secondPrizeWinners = winners.filter(w => w.prizeType === "second");

  // Default placeholder images
  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop";
  const defaultFemaleAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Page Banner Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Star className="w-4 h-4 text-white/30" />
            </motion.div>
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Trophy className="w-16 md:w-20 h-16 md:h-20 mx-auto text-white mb-4 md:mb-6 drop-shadow-lg" />
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
              WinnersHub
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Congratulations to our lucky winners! Every month, we reward our valued customers with exciting prizes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* First Prize Winner */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : firstPrizeWinner ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-lg font-semibold shadow-lg">
                <Trophy className="w-6 h-6" />
                First Prize Winner
              </span>
            </div>

            <motion.div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={firstPrizeWinner.image || defaultFemaleAvatar}
                    alt={firstPrizeWinner.name}
                    className="w-full h-full object-cover min-h-[300px] md:min-h-[400px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <motion.div
                    className="absolute bottom-6 left-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                      <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </motion.div>
                </div>
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {firstPrizeWinner.name}
                    </h2>
                    <p className="text-amber-600 font-semibold mb-3 md:mb-4">
                      Order: {firstPrizeWinner.orderId}
                    </p>
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Medal className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                      <span className="text-lg md:text-xl font-bold text-gray-700">
                        Won: {firstPrizeWinner.prize}
                      </span>
                    </div>
                    {firstPrizeWinner.testimonial && (
                      <p className="text-gray-600 italic mb-4 md:mb-6 border-l-4 border-amber-400 pl-4">
                        "{firstPrizeWinner.testimonial}"
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Winner Announcement: {new Date(firstPrizeWinner.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No first prize winner yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Second Prize Winners */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full text-lg font-semibold shadow-lg">
            <Medal className="w-6 h-6" />
            Second Prize Winners (1 Gram Gold Coin Each)
          </span>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : secondPrizeWinners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {secondPrizeWinners.map((winner, index) => (
              <motion.div
                key={winner._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <img
                      src={winner.image || defaultAvatar}
                      alt={winner.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Medal className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {winner.name}
                    </h3>
                    <p className="text-amber-600 text-sm font-medium mb-2">
                      {winner.orderId}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Medal className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">{winner.prize}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(winner.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Medal className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No second prize winners yet.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready to Win?
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            Start shopping now and be part of our next lucky draw! The more you shop, the higher your chances of winning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Trophy className="w-5 h-5 md:w-6 md:h-6" />
              Shop Now & Win
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GoldWinners;
