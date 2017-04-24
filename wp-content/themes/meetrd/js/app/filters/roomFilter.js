angular.module('roomSearchFilter', []).filter('roomFilter', [function () {
    return function (rooms, query) {

        if (!angular.isUndefined(rooms) && !angular.isUndefined(query)) {
            var filteredRooms = [];
            var pushRoom, pushRoomWithoutAddress;
            //Are there any inputs
            var hasNrOfPeople = query.nrOfPeople !== '' || query.nrOfPeople !== null;
            var hasCompany = query.companyName !== null;
            var hasCity = query.city !== null;
            var hasAddress = query.address !== null;


            var nrOfHitsWithoutAddress = 0;

            //The logix
//            if (!hasNrOfPeople && !hasCompany && !hasCity) {
    //                query.isSearchResult = false;
    //            } else {
    //                query.isSearchResult = true;
    //            }


            angular.forEach(rooms, function (room) {
                //The conditions
                var nrOfPeopleCondition = room.nrOfPeople >= query.nrOfPeople;
                var companyCondition = room.company === query.companyName;
                var cityCondition = room.city === query.city;
                var addressCondition = room.address === query.address;


                if (hasNrOfPeople && hasCompany && hasCity && hasAddress) {
                    pushRoomWithoutAddress = nrOfPeopleCondition && companyCondition && cityCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (hasNrOfPeople && hasCompany && hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition && cityCondition;

                } else if (hasNrOfPeople && hasCompany && !hasCity && hasAddress) {
                    pushRoomWithoutAddress = nrOfPeopleCondition && companyCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (hasNrOfPeople && hasCompany && !hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition;

                } else if (hasNrOfPeople && !hasCompany && hasCity && hasAddress) {
                    pushRoomWithoutAddress = nrOfPeopleCondition && cityCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (hasNrOfPeople && !hasCompany && hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && cityCondition;

                } else if (hasNrOfPeople && !hasCompany && !hasCity && hasAddress) {
                    pushRoomWithoutAddress = nrOfPeopleCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (hasNrOfPeople && !hasCompany && !hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition;

                } else if (!hasNrOfPeople && hasCompany && hasCity && hasAddress) {
                    pushRoomWithoutAddress = companyCondition && cityCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (!hasNrOfPeople && hasCompany && hasCity && !hasAddress) {
                    pushRoom = companyCondition && cityCondition;

                } else if (!hasNrOfPeople && !hasCompany && hasCity && hasAddress) {
                    pushRoomWithoutAddress = cityCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (!hasNrOfPeople && !hasCompany && hasCity && !hasAddress) {
                    pushRoom = cityCondition;

                } else if (!hasNrOfPeople && hasCompany && !hasCity && hasAddress) {
                    pushRoomWithoutAddress = companyCondition;
                    if (pushRoomWithoutAddress) {
                        nrOfHitsWithoutAddress++;
                    }
                    pushRoom = pushRoomWithoutAddress && addressCondition;
                } else if (!hasNrOfPeople && hasCompany && !hasCity && !hasAddress) {
                    pushRoom = companyCondition;

                } else if (!hasNrOfPeople && !hasCompany && !hasCity && hasAddress) {
                    pushRoom = addressCondition;

                } else {
                    pushRoom = true;
                }

                if (pushRoom) {
                    filteredRooms.push(room);
                }
            });

            // If there is no address - set nr of hits withoutaddress to nr of hits value
            if (!hasAddress) {
                nrOfHitsWithoutAddress = filteredRooms.length;
            }
            query.nrOfHitsWithoutAddress = nrOfHitsWithoutAddress;
            query.nrOfHits = filteredRooms.length;
            console.log("nrofhits: " + query.nrOfHits + " nrofhitswithoutaddress: " + nrOfHitsWithoutAddress);
            if (query.nrOfHits < query.shownRoomsDefault) {
                query.shownRooms = query.nrOfHits;
            }
            return filteredRooms;
        } else {
            query.nrOfHits = rooms.length;
            return rooms;
        }
    };
}]);