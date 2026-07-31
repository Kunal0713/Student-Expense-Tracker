import { UAParser } from 'ua-parser-js';
import Visitor from '../models/Visitor.js';

const getRequestIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());

    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  return req.ip || req.socket?.remoteAddress || 'Unknown';
};

export const logVisitor = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const parser = new UAParser(userAgent);

    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const device = parser.getDevice().type || 'desktop';

    await Visitor.create({
      ip: getRequestIp(req),
      browser,
      os,
      device,
      userAgent
    });

    return res.status(201).json({
      success: true,
      message: 'Visitor logged successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    const latestVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      totalVisitors,
      latestVisitors
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};