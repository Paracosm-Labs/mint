import User from "@/models/user";
import Business from "../models/business";
import Club from "../models/club";
import Deal from "../models/deal";

const loadUserData = async (userAddress) => {
  try {
    // Step 1: Find the user by address
    const user = await User.findOne({ address: userAddress });
    if (!user) {
      throw new Error("User not found");
    }

    const userId = user._id;

    // Step 2: Find all businesses owned by the user
    const businesses = await Business.find({ owner: userId });

    // Step 3: Find all clubs associated with the businesses
    const businessIds = businesses.map((business) => business._id);
    const clubs = await Club.find({ business: { $in: businessIds } });

    // Step 4: Find all deals associated with the clubs and businesses
    const clubIds = clubs.map((club) => club._id);
    const deals = await Deal.find({
      $or: [
        { club: { $in: clubIds } }, // Deals associated with the clubs
        { business: { $in: businessIds } }, // Deals associated with the businesses
      ],
    });

    // Returning a consolidated object with all user data
    return {
      user,
      businesses: businesses[0],
      clubs: clubs[0],
      deals,
    };
  } catch (error) {
    console.error("Error loading user data: ", error.message);
    throw error;
  }

};
export default loadUserData;
