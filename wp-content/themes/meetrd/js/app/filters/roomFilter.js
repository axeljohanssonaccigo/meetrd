angular.module('roomSearchFilter', []).filter('roomFilter', [function () {
    return function (rooms, query) {

        if (!angular.isUndefined(rooms) && !angular.isUndefined(query)) {
            //            query.hasFiltered = false;
            var filteredRooms = [];
            console.log("filters");
            // query.roomsOnMap = [];
            angular.forEach(rooms, function (room) {

                var pushRoom;
                //Are there any inputs
                var hasNrOfPeople = query.nrOfPeople !== '';
                var hasCompany = query.companyName !== null;
                var hasCity = query.city !== null;
                var hasAddress = query.address !== null;

                //The conditions
                var nrOfPeopleCondition = room.nrOfPeople >= query.nrOfPeople;
                var companyCondition = room.company === query.companyName;
                var cityCondition = room.city === query.city;
                var addressCondition = room.address === query.address;

                //The logix
                if (!hasNrOfPeople && !hasCompany && !hasCity && !hasAddress) {
                    query.isSearchResult = false;
                } else {
                    query.isSearchResult = true;
                }
                if (hasNrOfPeople && hasCompany && hasCity && hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition && cityCondition && addressCondition;
                } else if (hasNrOfPeople && hasCompany && hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition && cityCondition;

                } else if (hasNrOfPeople && hasCompany && !hasCity && hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition && addressCondition;
                } else if (hasNrOfPeople && hasCompany && !hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && companyCondition;

                } else if (hasNrOfPeople && !hasCompany && hasCity && hasAddress) {
                    pushRoom = nrOfPeopleCondition && cityCondition && addressCondition;
                } else if (hasNrOfPeople && !hasCompany && hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition && cityCondition;

                } else if (hasNrOfPeople && !hasCompany && !hasCity && hasAddress) {
                    pushRoom = nrOfPeopleCondition && addressCondition;
                } else if (hasNrOfPeople && !hasCompany && !hasCity && !hasAddress) {
                    pushRoom = nrOfPeopleCondition;

                } else if (!hasNrOfPeople && hasCompany && hasCity && hasAddress) {
                    pushRoom = companyCondition && cityCondition && addressCondition;
                } else if (!hasNrOfPeople && hasCompany && hasCity && !addressCondition) {
                    pushRoom = companyCondition && cityCondition;

                } else if (!hasNrOfPeople && !hasCompany && hasCity && hasAddress) {
                    pushRoom = cityCondition && addressCondition;
                } else if (!hasNrOfPeople && !hasCompany && hasCity && !hasAddress) {
                    pushRoom = cityCondition;

                } else if (!hasNrOfPeople && hasCompany && !hasCity && hasAddress) {
                    pushRoom = companyCondition && addressCondition;
                } else if (!hasNrOfPeople && hasCompany && !hasCity && !hasAddress) {
                    pushRoom = companyCondition;

                } else if (!hasNrOfPeople && !hasCompany && !hasCity && hasAddress) {
                    pushRoom = addressCondition;

                } else {
                    pushRoom = true;
                }

                if (pushRoom) {
                    if (addressCondition) {
                        console.log(room.address + " i " + room.city);
                    }

                    filteredRooms.push(room);
                }
            });
            query.nrOfHits = filteredRooms.length;
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