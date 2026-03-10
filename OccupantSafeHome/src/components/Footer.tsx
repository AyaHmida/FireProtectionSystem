function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Occupant Safe Home. All rights reserved.</p>
      <p>Smart Home Security & Safety Management System</p>
    </footer>
  )
}

export default Footer
