import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const contactSchema = zod.object({
  name: zod.string().min(2, "Name is required"),
  email: zod.string().email("Invalid email address"),
  message: zod.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormInput = zod.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    // Simulate contact submission
    void data;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you! Your message has been sent to our guest support team.");
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-heading font-extrabold tracking-tight">
          Contact <span className="text-primary">Guest Support</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Get in touch with the CineVerse luxury guest relation desk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="space-y-6">
          <div className="glass-panel border border-white/5 p-6 rounded-xl flex gap-4 items-start">
            <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg shadow-redGlow">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Main Entrance Address</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                CineVerse Luxury Theatre, 5th Avenue, Cyber City, Bangalore - 560001
              </p>
            </div>
          </div>

          <div className="glass-panel border border-white/5 p-6 rounded-xl flex gap-4 items-start">
            <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-lg shadow-blueGlow">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Helpline Desk</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Helpline: +91 80 4444 8888 <br />
                Priority Lounge Concierge: +91 80 4444 8899
              </p>
            </div>
          </div>

          <div className="glass-panel border border-white/5 p-6 rounded-xl flex gap-4 items-start">
            <div className="p-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg shadow-purpleGlow">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">General Enquiries</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                General Support: support@cineversepro.com <br />
                Advertising & Branding: brands@cineversepro.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Message form */}
        <div className="glass-panel border border-white/10 p-8 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black shadow-glass">
          <h2 className="text-xl font-heading font-extrabold mb-6 text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-sm"
              />
              {errors.name && (
                <p className="text-primary text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-sm"
              />
              {errors.email && (
                <p className="text-primary text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Message Content
              </label>
              <textarea
                rows={4}
                placeholder="How can our box office lounge assist you today..."
                {...register("message")}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-sm resize-none"
              />
              {errors.message && (
                <p className="text-primary text-xs mt-1.5">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold tracking-wider hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
