import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

interface GoldWinner {
  _id: string;
  name: string;
  district: string;
  prizeType: string;
}

const GoldWinners = () => {
  const [mounted, setMounted] = useState(false);
  const [winners, setWinners] = useState<GoldWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchWinners();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035/api";

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
              Participate & Win Gold Every Day!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Daily Box Visual Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Row 1: 5g Coin - 1 Winner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white p-8 rounded-2xl shadow-xl border border-amber-200"
          >
            <div className="w-48 h-48 relative shrink-0">
              {/* 5g Coin Image */}
              <img
                src="/5g.png"
                alt="5 Gram Gold Coin"
                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                Winner #1
              </div>
            </div>
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-3xl font-bold text-amber-800">5 Gram Gold Coin</h3>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-xl border-2 border-amber-300">1</span>
                <p className="text-xl text-amber-900 font-medium">Lucky Winner Every Day!</p>
              </div>
              <p className="text-amber-700/80">Make a purchase to enter the daily draw and stand a chance to win this grand prize.</p>
            </div>
          </motion.div>

          {/* Row 2: 1g Coin - 4 Winners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-yellow-700 mb-2">1 Gram Gold Coin</h3>
              <p className="text-lg text-yellow-800 font-medium">4 Lucky Winners Every Day!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[2, 3, 4, 5].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 relative group">
                    <img
                      src="/1g.png"
                      alt="1 Gram Gold Coin"
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                      Winner #{item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Today's Winners Table Section */}
      <section className="py-12 bg-white/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              Today's Winners
            </h2>
            <p className="text-gray-500 mt-2">Check the list below to see if you won!</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : winners.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-500 text-white">
                      <th className="px-6 py-4 text-left font-bold w-20">Sl.No</th>
                      <th className="px-6 py-4 text-left font-bold">Winner Name</th>
                      <th className="px-6 py-4 text-left font-bold">District</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {winners.map((winner, index) => (
                      <tr
                        key={winner._id}
                        className="hover:bg-amber-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-amber-900 border-r border-amber-100/50">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold border-r border-amber-100/50">
                          <div className="flex items-center gap-2">
                            {index < 3 && <Trophy className={`w-4 h-4 ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`} />}
                            {winner.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {winner.district}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Winners list will be updated soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready to be the Next Winner?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start shopping now and be part of our next lucky draw! The more you shop, the higher your chances of winning.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Trophy className="w-6 h-6" />
            Shop Now & Win
          </Link>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GoldWinners;
