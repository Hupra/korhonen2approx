import { motion } from "framer-motion"

const speed = 0.5;

const scroll = {
    initial: {opacity: 1, y: "100%"},
    animate: {opacity: 1, y: 0, transition: {
        duration: speed,
        // type: "spring",
        // stiffness: 2
      } },
    exit: {opacity: 1, y: "-96%", transition: {
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

const AnimatedPage = ({children}) => {
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