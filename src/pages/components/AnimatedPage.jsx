import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const speed = 0.65;

const scroll = {
    initial: {opacity: 1, y: "100%"},
    animate: {opacity: 1, y: 0, transition: {
        duration: speed,
        // type: "spring",
        // stiffness: 2
      } },
    exit: {opacity: 1, y: "-100%", transition: {
        duration: speed,
        // type: "spring",
        // stiffness: 2
      } }
}

const layer = {
    initial: {opacity: 1, zIndex: 5, y: 0},
    animate: {opacity: 1, zIndex: 2, y: 0, transition: {
        duration: speed
      } },
    exit: {opacity: 1, zIndex: 5, y: "-98%", transition: {
        duration: speed
      } }
}

const AnimatedPage = ({ children }) => {
  const location = useLocation();
  console.log(1,location);
  
    return (
        <motion.div
            className="animated-page"
            variants={scroll} 
            initial="initial" 
            animate="animate" 
            exit="exit">

            {children}
        </motion.div>
    )
}

export default AnimatedPage