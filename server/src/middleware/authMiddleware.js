exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    next();
  };
  
  exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };
  