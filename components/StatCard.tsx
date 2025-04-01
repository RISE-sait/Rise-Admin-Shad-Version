import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }: any) => {
  return (
    <motion.div
      className="h-full bg-card rounded-xl shadow-sm hover:shadow-md border border-border transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {name}
          </span>
        </div>
        <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      </div>
      <div 
        className="w-full h-1"
        style={{
          background: `linear-gradient(90deg, ${color}20, ${color}, ${color}20)`,
          opacity: 0.6
        }}
      />
    </motion.div>
  );
};

export default StatCard;